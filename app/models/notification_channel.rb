# frozen_string_literal: true

class NotificationChannel
  class << self
    def language_channel(lang_or_id)
      "Lng#{lang_or_id.is_a?(Integer) ? lang_or_id : lang_or_id.id} "
    end

    def cluster_channel(cl_or_id)
      "Cls#{cl_or_id.is_a?(Integer) ? cl_or_id : cl_or_id.id} "
    end

    def region_channel(reg_or_id)
      "Reg#{reg_or_id.is_a?(Integer) ? reg_or_id : reg_or_id.id} "
    end

    def domain_channel(domain)
      "D#{domain.to_s.camelize.slice(0, 3)} "
    end

    def add_channel(channels_str, channel)
      channels_str.include?(channel) ? channels_str : channels_str + channel
    end

    def remove_channel(channels_str, channel)
      channels_str.gsub(channel, '')
    end

    def channels_for(*items)
      to_str(
        items
          .flatten
          .map do |item|
            case
            when item.is_a?(Language) then channels_for_language(item)
            when item.is_a?(Cluster) then channels_for_cluster(item)
            when Domain.domains.include?(item.to_s) then channels_for_domains([item])
            else raise "NotificationChannel.channels_for doesn't know how to handle #{item}!"
            end
          end
          .flatten
          .uniq
      )
    end

    def match_channels(channels_str, src, colname = 'notification_channels')
      channels = to_array(channels_str)
      return [] if channels == []

      query = channels.map { "#{colname} LIKE ?" }.join(' OR ')
      subs = channels.map { |c| "%#{c}%" }
      src.where(query, *subs)
    end

    def people_for_channels(channels_str)
      match_channels(channels_str, Person)
    end

    private

    def channels_for_language(language)
      region = language.get_region
      channels = [language_channel(language.id)]
      channels << cluster_channel(language.cluster_id) if language.cluster_id
      channels << region_channel(region.id) if region
      channels
    end

    def channels_for_cluster(cluster)
      channels = [cluster_channel(cluster.id)]
      channels += cluster.language_ids.map { |id| language_channel(id) }
      channels << region_channel(cluster.region_id) if cluster.region_id
      channels
    end

    def channels_for_domains(domains)
      domains
        .map { |d| domain_channel(d) }
        .reject(&:nil?)
    end

    def to_str(channels)
      channels.join('')
    end

    def to_array(channels_str) 
      channels_str.split(/(?<= )/)
    end
  end
end
